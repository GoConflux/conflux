module StatusCodes

  # Generic
  UnknownError       = StatusDef.new :UnknownError,     1000
  PermissionDenied   = StatusDef.new :PermissionDenied, 1001
  ResourceNotFound   = StatusDef.new :ResourceNotFound, 1002
  RequiredParamsMissing = StatusDef.new :RequiredParamsMissing, 1003

  # User
  UserNotFound       = StatusDef.new :UserNotFound, 2000
  UserCreationFailed = StatusDef.new :UserCreationFailed, 2001
  UserUpdateFailed = StatusDef.new :UserUpdateFailed, 2002

  # Team
  TeamNotFound       = StatusDef.new :TeamNotFound, 3000
  TeamCreationFailed = StatusDef.new :TeamCreationFailed, 3001
  TeamUpdateFailed = StatusDef.new :TeamUpdateFailed, 3002
  TeamDestroyFailed = StatusDef.new :TeamDestroyFailed, 3003

  # Pipeline
  PipelineNotFound       = StatusDef.new :PipelineNotFound, 4000
  PipelineCreationFailed = StatusDef.new :PipelineCreationFailed, 4001
  PipelineUpdateFailed = StatusDef.new :PipelineUpdateFailed, 4002
  PipelineDestroyFailed = StatusDef.new :PipelineDestroyFailed, 4003

  # Tier
  TierNotFound       = StatusDef.new :TierNotFound, 5000
  TierCreationFailed = StatusDef.new :TierCreationFailed, 5001
  TierUpdateFailed = StatusDef.new :TierUpdateFailed, 5002
  TierDestroyFailed = StatusDef.new :TierDestroyFailed, 5003

  # App
  AppNotFound       = StatusDef.new :AppNotFound, 6000
  AppCreationFailed = StatusDef.new :AppCreationFailed, 6001
  AppUpdateFailed = StatusDef.new :AppUpdateFailed, 6002
  AppDestroyFailed = StatusDef.new :AppDestroyFailed, 6003

  # AppAddon
  AppAddonNotFound       = StatusDef.new :AppAddonNotFound, 7000
  AppAddonCreationFailed = StatusDef.new :AppAddonCreationFailed, 7001
  AppAddonUpdateFailed = StatusDef.new :AppAddonUpdateFailed, 7002
  AppAddonDestroyFailed = StatusDef.new :AppAddonDestroyFailed, 7003

  # Addon
  AddonNotFound       = StatusDef.new :AddonNotFound, 8000
  AddonCreationFailed = StatusDef.new :AddonCreationFailed, 8001

  # Key
  KeyNotFound       = StatusDef.new :KeyNotFound, 9000
  KeyCreationFailed = StatusDef.new :KeyCreationFailed, 9001
  KeyUpdateFailed = StatusDef.new :KeyUpdateFailed, 9002
  KeyDestroyFailed = StatusDef.new :KeyDestroyFailed, 9003

end
