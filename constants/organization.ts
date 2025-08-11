type OrganizationName = "ZO" | "zaměstnanec" | "veřejnost"

interface OrganizationConfig {
  name: OrganizationName;
}

export class Organization {
  private static readonly organizations = new Map<OrganizationName, Organization>();
  
  private static readonly organizationConfigs: OrganizationConfig[] = [
    { name: "ZO" },
    { name: "zaměstnanec" },
    { name: "veřejnost" },
  ];

  public readonly name: OrganizationName;

  private constructor(config: OrganizationConfig) {
    this.name = config.name;
  }

  static {
    this.organizationConfigs.forEach(config => {
      this.organizations.set(config.name, new Organization(config));
    });
  }

  static getOrganization(name: OrganizationName): Organization {
    return this.organizations.get(name)!;
  }

  static getAllOrganizations(): Organization[] {
    return Array.from(this.organizations.values());
  }
}