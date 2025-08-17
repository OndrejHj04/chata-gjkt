type VisibilityName = "veřejné" | "soukromé"

interface VisibilityConfig {
  name: VisibilityName;
}

export class Visibility {
  private static readonly visibilities = new Map<VisibilityName, Visibility>();
  
  private static readonly visibilityConfigs: VisibilityConfig[] = [
    { name: "veřejné"  },
    { name: "soukromé" },
  ];

  public readonly name: VisibilityName;

  private constructor(config: VisibilityConfig) {
    this.name = config.name;
  }

  static {
    this.visibilityConfigs.forEach(config => {
      this.visibilities.set(config.name, new Visibility(config));
    });
  }

  static getVisibility(name: VisibilityName): Visibility {
    return this.visibilities.get(name)!;
  }

  static getAllVisibilities(): Visibility[] {
    return Array.from(this.visibilities.values());
  }
}