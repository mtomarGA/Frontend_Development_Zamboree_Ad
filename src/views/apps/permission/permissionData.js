// export const MODULES = ['employees', 'todos', 'projects', 'tasks','role']

import AnnounceService from "@/services/announce/services"

// export const PERMISSIONS = ['view', 'edit', 'delete', 'add', 'global_view']
export const PERMISSIONS = ['view', 'edit', 'delete', 'add', 'global_view']


export const MODULES = [
  {
    name: 'user', submodules: [
      { name: 'all_users', permissions: ['view', 'edit', 'delete', 'global_view'] },
      { name: 'create_user', permissions: ['add'] },
      { name: "user_master", permissions: ['view', 'add', 'edit', 'delete'] }
    ]
  },
  {
    name: 'partner',
    submodules: [
      { name: 'all_partner', permissions: ['view', 'add', 'delete', 'edit', 'global_view'] },
      { name: 'update_partner', permissions: ['view', 'edit', 'delete'] },
      // { name: 'add_listing', permissions: ['view', 'add'] },
      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'packages', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "packages_transactions", permissions: ['view', 'delete'] },
    ]
  },

  {
    name: 'premium', submodules: [
      { name: "paid_listing", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "fixed_listing", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "banner_listing", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "proposal", permissions: ['view'] },
      { name: "invoice", permissions: ['view'] },
      { name: "approval", permissions: ['view'] },
      { name: "paid_master", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "fixed_master", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "banner_master", permissions: ['view', 'add', 'edit', 'delete'] },
    ]
  },


  {
    name: 'product',
    submodules: [
      { name: "add_update", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
    ]
  },
  { name: 'location_master', permissions: ['view', 'add', 'edit', 'delete'] },
  {
    name: 'approval',
    submodules: [
      { name: 'listing_approval', permissions: ['view', 'edit'] },
      { name: 'image_approval', permissions: ['view', 'edit'] },
      { name: 'product_approval', permissions: ['view', 'edit'] },
      { name: 'review_approval', permissions: ['view', 'edit'] },
    ]
  },
  {
    name: 'happening', submodules: [
      { name: "post", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "story", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "polls", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "manage", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "post_approve", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "story_approve", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "polls_approve", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "post_report", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "comment_report", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "polls_report", permissions: ['view', 'add', 'edit', 'delete'] },
    ]
  },
  // spiritual module
  {
    name: 'spiritual', submodules: [
      { name: "hinduism_manage_temple", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "hinduism_manage_content", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "hinduism_festival", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "hinduism_live_darshan", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "hinduism_setting", permissions: ['view', 'edit',] },
      { name: "islam_prayer_times", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_reciter_list", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_quran_chapters", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_dua_category", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_dua", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_dua", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_dikhras", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_allah_name", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "islam_setting", permissions: ['view', 'edit'] },
      { name: "islam_mosque", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "sikh_manage_gurudwara", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "sikh_manage_content", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "sikhism_setting", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "sikhism_festival", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "sikhism_live_darshan", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "jain_manage_content", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "jain_festival", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "jain_live_darshan", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "jain_setting", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "jain_manage_temple", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "buddhism_manage_content", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "buddhism_festival", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "buddhism_live_darshan", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "buddhism_setting", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "buddhism_manage_temple", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "christ_manage_church", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "christ_festival", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "christ_live_darshan", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "christ_setting", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "christ_manage_content", permissions: ['view', 'add', 'edit', 'delete'] }

    ]
  },
  // event module
  // {
  //   name: 'event', submodules: [
  //     // { name: 'dashboard', permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: 'masters', permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "manageEvents", permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "withdraw_requests", permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "event_approval", permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "event_report", permissions: ['view', 'add', 'edit', 'delete'] }
  // // event module
  // {
  //   name: 'event', submodules: [
  //     // { name: 'dashboard', permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: 'masters', permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "manageEvents", permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "withdraw_requests", permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "event_approval", permissions: ['view', 'add', 'edit', 'delete'] },
  //     { name: "event_report", permissions: ['view', 'add', 'edit', 'delete'] }

  //   ]
  // },
  //   ]
  // },
  // utsav module
  {
    name: 'utsav', submodules: [
      { name: 'banner', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'promotional_banner', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'manage_utsav', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'vendor_wise_utsav', permissions: ['view', 'edit', 'delete'] },
      { name: 'approval', permissions: ['view', 'edit', 'delete'] },
      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "issue_report", permissions: ['view', 'edit', 'delete'] },
    ]
  },

  // announce module
  { name: 'announce', permissions: ['view', 'add', 'edit', 'delete'] },

  // newsletter module  
  { name: 'newsletter', permissions: ['view', 'add', 'edit', 'delete'] },

  { name: 'mail', permissions: ['view'] },
  { name: 'partner_banner_setup', permissions: ['view', 'add', 'edit', 'delete'] },
  { name: 'business_rating', permissions: ['view', 'add', 'edit', 'delete'] },

  // quiz module
  {
    name: 'quiz', submodules: [
      { name: 'quiz_type', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'quiz_zone', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'dailyquiz', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "contest", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "funAndLearn", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "guesstheword", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "trueAndFalse", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "leaderboard", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "coin_plan", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "notification", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'user_details', permissions: ['view', 'add', 'edit'] },
      { name: 'activity_tracker', permissions: ['view', 'add'] },
      { name: 'in_app_purchase', permissions: ['view', 'add', 'edit', 'delete'] },
    ]
  },


  // event module
  {
    name: 'event', submodules: [
      // { name: 'dashboard', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'masters', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "manageEvents", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "dots", permissions: ['view'] },
      { name: "commission", permissions: ['view'] },
      { name: "withdraw_requests", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "event_approval", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "event_report", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "banner", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'invoices', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'scanner_app_user', permissions: ['view', 'add', 'edit', 'delete'] },

    ]
  },

  // Leave Management
  {
    name: 'leave management', submodules: [

      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'leaveSetup', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "leaveApplication", permissions: ['view', 'add', 'edit', 'delete', "global_view"] },
      { name: "report", permissions: ['view'] },
      { name: 'manageHoliday', permissions: ['view', 'add', 'edit', 'delete'] },

    ]
  },

  {
    name: 'attendance', submodules: [
      { name: "master_shift", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "master_config", permissions: ['view', 'add', 'edit'] },
      { name: "master_office_policy", permissions: ['view', 'add', 'edit', 'delete'] },
      // { name: 'punch', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "daily_Attendance", permissions: ['view', 'add'] },
      { name: "my_Attendance", permissions: ['view', 'add'] },
      { name: "monthly_Attendance", permissions: ['view', 'add', 'global_view'] },
      { name: "attendance_filter", permissions: ['view', 'add', 'edit', 'delete'] },

    ]
  },


  // Core HR
  {
    name: 'core HR', submodules: [

      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "award", permissions: ['view', 'add', 'edit', 'delete', "global_view"] },
      { name: "complaints", permissions: ['view', 'add', 'edit', 'delete', "global_view"] },
      { name: "warning", permissions: ['view', 'add', 'edit', 'delete', "global_view"] },

    ]
  },



  // Payroll
  {
    name: 'payroll', submodules: [

      { name: 'earning', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'deduction', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'reimbursement', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'salarySetup', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'generateSalary', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'paymentHistory', permissions: ['view', 'edit'] },

    ]
  },





  // follow up module
  {
    name: 'follow_up', submodules: [
      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'team', permissions: ['view', 'global_view'] },
      { name: 'meeting', permissions: ['view', 'add', 'edit', 'global_view'] },
      { name: 'calls', permissions: ['view', 'add', 'edit', 'global_view'] }
    ]
  },
  {
    name: 'employees',
    submodules: [
      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'all_employees', permissions: ['view', 'add', 'edit', 'delete', 'global_view'] }
    ]
  },

  {
    name: 'utsav_package',
    submodules: [
      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'voucher_type', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'utsav_packages_list', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'discount_List', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'All_orders', permissions: ['view', 'edit', 'delete', 'global_view'] },
      { name: 'order_status', permissions: ['edit'] },
      { name: 'members_list', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'approvel_list', permissions: ['view', 'edit', 'delete', 'global_view'] }
    ]
  },

  //Support System
  {
    name: 'customer_care_ticket',
    submodules: [
      { name: "all_tickets", permissions: ['view', 'add', 'edit', 'delete', 'global_view'] },
      { name: 'predefined_reply', permissions: ['view', 'add', 'edit', 'delete'] },
    ]
  },
  {
    name: 'live_meeting',
    submodules: [
      { name: "all_meetings", permissions: ['view', 'add', 'edit', 'delete', 'global_view'] },

    ]

  },

  {
    name: 'event_calendar',
    submodules: [
      { name: "calendar", permissions: ['view', 'add', 'edit', 'delete', 'global_view'] },
    ]
  },

  {
    name: 'performance',
    submodules: [

      { name: 'goal', permissions: ['view', 'add', 'edit', 'delete', 'global_view'] }
    ]
  },

  {
    name: 'bug', submodules: [
      { name: 'all_bugs', permissions: ['view', 'add', 'edit', 'delete', 'global_view'] },
      { name: 'category', permissions: ['view', 'add', 'edit', 'delete'] }
    ]
  },
  {
    name: 'todos',
    submodules: [
      // { name: 'master', permissions: ['view', 'add','edit','delete', 'global_view'] },
      { name: 'all_todo', permissions: ['view'] }
    ]
    //   permissions: ['view', 'add', 'edit']
  },
  // announce module
  { name: 'announce', permissions: ['view', 'add', 'edit', 'delete'] },
  //keywords

  {
    name: 'keywords', submodules: [
      { name: "manage", permissions: ['view', 'add', 'edit', 'delete'] },
      { name: "import", permissions: ['view', 'add'] },
      { name: "report", permissions: ['view', 'add',] },
    ]
  },
  {
    name: 'blog', submodules: [
      { name: 'master', permissions: ['view', 'add', 'edit', 'delete'] },
      { name: 'all_blogs', permissions: ['view', 'add', 'edit', 'delete', 'global_view'] },
      { name: "approve", permissions: ['view', 'add', 'edit', 'delete'] }
    ]
  },
  // newsletter module  
  { name: 'newsletter', permissions: ['view', 'add', 'edit', 'delete'] },

  // event banner module
  { name: 'event_banner', permissions: ['view', 'add', 'edit', 'delete'] },


  {
    name: 'role',
    permissions: ['view', 'add', 'edit', 'global_view']
  },

  {
    name: 'settings', submodules: [
      { name: 'application_settings', permissions: ['view', 'edit'] },
    ]
  },








]
