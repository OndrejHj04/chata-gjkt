type StatusName = "archiv" | "čeká na potvrzení" | "potvrzeno" | "zamítnuto" | "blokováno správcem"
type StatusColor = "#999999" | "#FCD34D" | "#34D399" | "#ED9191"
type StatusIcon = "folder_delete_icon" | "running_with_errors" | "done_all_icon" | "gpp_bad_icon" | "do_disturb_icon"

interface StatusConfig {
  name: StatusName;
  color: StatusColor,
  icon: StatusIcon
}

export class Status {
  private static readonly status = new Map<StatusName, Status>();
  
  private static readonly statusConfigs: StatusConfig[] = [
    { name: "archiv", color: "#999999", icon: "folder_delete_icon" },
    { name: "čeká na potvrzení", color: "#FCD34D", icon: "running_with_errors" },
    { name: "potvrzeno", color: "#34D399", icon: "done_all_icon" },
    { name: "zamítnuto", color: "#ED9191", icon: "gpp_bad_icon" },
    { name: "blokováno správcem", color: "#ED9191", icon: "do_disturb_icon" },
  ];

  public readonly name: StatusName;
  public readonly color: StatusColor;
  public readonly icon: StatusIcon;

  private constructor(config: StatusConfig) {
    this.name = config.name;
    this.color = config.color;
    this.icon = config.icon;
  }

  static {
    this.statusConfigs.forEach(config => {
      this.status.set(config.name, new Status(config));
    });
  }

  static getStatus(name: StatusName): Status {
    return this.status.get(name)!;
  }

  static getAllStatus(): Status[] {
    return Array.from(this.status.values());
  }

  static getFilteredStatus(names: StatusName[]): Status[] {
    return Array.from(this.status.values()).filter((status)=>names.includes(status.name))
  }
}