type RoleName = "admin" | "uživatel" | "veřejnost"

interface RoleConfig {
  name: RoleName;
}

export class Role {
  private static readonly roles = new Map<RoleName, Role>();
  
  private static readonly roleConfigs: RoleConfig[] = [
    { name: "admin"  },
    { name: "uživatel" },
    { name: "veřejnost" },
  ];

  public readonly name: RoleName;

  private constructor(config: RoleConfig) {
    this.name = config.name;
  }

  static {
    this.roleConfigs.forEach(config => {
      this.roles.set(config.name, new Role(config));
    });
  }

  static getRole(name: RoleName): Role {
    return this.roles.get(name)!;
  }

  static getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }
}