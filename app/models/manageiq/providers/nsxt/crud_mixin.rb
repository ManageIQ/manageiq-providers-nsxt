module ManageIQ::Providers::Nsxt::CrudMixin
  extend ActiveSupport::Concern

  module ClassMethods
    def nsxt_execute_action(ext_management_system, vars, options = {})
      $nsxt_log.info("Start action #{options[:action]} for #{self.display_name})")

      options[:template_job_prefix] ||= "nsxt_#{self.nsxt_type}"
      options[:template_job_name] ||= "#{options[:template_job_prefix]}_#{options[:action]}"
      options[:template_job_response_prefix] ||= options[:template_job_prefix]
      options[:ems_ref] ||= vars["#{self.nsxt_type}_id".to_sym]
      options[:name] ||= vars["#{self.nsxt_type}_name".to_sym]

      $log.info("options #{options}")

      response = ansible_run_job(options, vars)
      options[:ems_ref] ||= response["#{options[:template_job_response_prefix]}_id"]
      inventory_refresh(ext_management_system, options)
      options[:id] ||= ems_ref_to_id(options[:ems_ref])
      create_notification(options)

      $nsxt_log.info("Succesfully finished action #{options[:action]} for #{self.display_name})")
      result = {
        :id => options[:id],
        :ems_ref => options[:ems_ref], 
        :name => options[:name]
      }
      task_set_results(options, result)
      return result
    rescue StandardError => error
      create_notification(options, error)
      raise error
    end

    def inventory_refresh(ext_management_system, options)
      refresh_ems_ref = options[:refresh_ems_ref] || options[:ems_ref]
      if (refresh_ems_ref.nil?)
        $nsxt_log.warn('Performing a full refresh of the inventory because of unknown ems_ref.')
        EmsRefresh.refresh(ext_management_system) 
      else
        EmsRefresh.refresh(
          InventoryRefresh::Target.new(
            :association => self.refresh_type,
            :manager_ref => {:ems_ref => refresh_ems_ref},
            :manager => ext_management_system
          )
        )
      end
    rescue StandardError => error
      $nsxt_log.error("Failed to refresh inventory: #{error}")
      raise "Failed to refresh inventory"
    end

    def create_notification(options, error = nil)
      if not error.nil?
        $nsxt_log.error(
          "Error for action #{options[:action]} #{self.display_name} " + 
          "(ems_ref = #{options[:ems_ref] || 'create'}), options = #{options}, error = #{error})"
        )
      end
      action = 'Creating' if options[:action] == 'create'
      action = 'Updating' if options[:action] == 'update'
      action = 'Deleting' if options[:action] == 'delete'
      action ||= options[:action]
      Notification.create!(
        :type    => error.nil? ? :nsxt_task_success : :nsxt_task_fail,
        :user_id => task_get_user_id(options),
        :options => {
          :action => action,
          :type => self.display_name,
          :subject  => options[:name],
          :error_message => error.nil? ? nil : error.to_s[0..128]
        }
      )
    end

    def ems_ref_to_id(ems_ref)
      return nil if ems_ref.nil?
      item = find_by(:ems_ref => ems_ref)
      return nil if item.nil?
      return item.id
    end

    def get_tenant_short_code(user)
      return 'VNX' if user.current_tenant.parent_name.nil?
      user.current_tenant.name
    end

    def task_get(options)
      task_id = options[:miq_task_id] || options[:task_id]
      return nil if task_id.nil?
      return MiqTask.find(task_id)
    end

    def task_get_user_id(options)
      task = task_get(options)
      return 1 if task.nil?
      return task.userid if is_integer?(task.userid)
      user = User.find_by(:userid => task.userid)
      return user&.id || 1
    end

    def task_set_results(options, result)
      task = task_get(options)
      task.results = result.to_json
      task.save
    end

    def ansible_run_job(options, vars)
      job_template = ansible_job_template_by_name(options[:template_job_name])
      args = {:extra_vars => vars}
      ansible_job = ManageIQ::Providers::AnsibleTower::AutomationManager::Job.create_job(job_template, args)
      ansible_wait_for_completed(ansible_job, options)
      return ansible_job.raw_artifacts
    end

    def ansible_job_template_by_name(job_template_name)
      job_template = ManageIQ::Providers::AnsibleTower::AutomationManager::ConfigurationScript
        .where('lower(name) = ?', job_template_name.downcase).first
      if job_template.nil?
        $nsxt_log.error("Ansible Tower template #{job_template_name} was not found")
        raise "Ansible Tower template #{job_template_name} was not found"
      end
      return job_template
    end

    def ansible_wait_for_completed(ansible_job, options = {})
      options = options.dup
      options[:sleep_time] ||= 5
      tower_job_status = ansible_job.raw_status
      $nsxt_log.debug("tower_job_status #{tower_job_status.normalized_status}")
      while not tower_job_status.completed?
        sleep(options[:sleep_time])
        tower_job_status = ansible_job.raw_status
        $nsxt_log.debug("tower_job_status #{tower_job_status.normalized_status}")
      end
      ansible_job.refresh_ems
      if not tower_job_status.succeeded?
        $nsxt_log.error("Ansible template job failed. Output: #{ansible_job.stdout}")
        raise 'Ansible template job failed'
      end
    end
  end
end