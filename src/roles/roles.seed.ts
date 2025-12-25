import { Injectable, OnModuleInit } from "@nestjs/common";
import { RolesService } from "./roles.service";
@Injectable()
export class RoleSeed implements OnModuleInit {
    constructor(
        private readonly rolesService: RolesService
    ) { }
    async onModuleInit() {
        await this.seedRoles();
    }

    async seedRoles() {
        const roles = [
            { name: 'admin', description: 'Administrator role' },
            { name: 'user', description: 'Regular user role' },
        ];
        for (const role of roles) {
            try{
                await this.rolesService.create(role)
            }catch(e){
                console.log(e.message)
            }
        }
    }

  
}