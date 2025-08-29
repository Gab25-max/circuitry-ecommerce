import { Logger, ConfigModule } from "@medusajs/framework/types"

export type ModuleOptions = {
  apiKey: string
}

type InjectedDependencies = {
  logger: Logger
  configModule: ConfigModule
}

class CmsModuleService {
  private options_: ModuleOptions
  private logger_: Logger

  constructor({ logger }: InjectedDependencies, options: ModuleOptions) {
    this.logger_ = logger
    this.options_ = options

    // TODO initialize SDK
  }
}

export default CmsModuleService