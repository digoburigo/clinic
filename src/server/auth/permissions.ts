import { createAccessControl, defaultStatements, adminAc, memberAc, ownerAc, } from "better-auth/plugins/access";
 
const statement = { 
    ...defaultStatements, 
    project: ["create", "share", "update", "delete"],
} as const;
 
export const ac = createAccessControl(statement);

export const cutomMemberAc = ac.newRole({ 
    project: ["create"], 
    ...memberAc.statements,
}); 

export const customAdminAc = ac.newRole({
    project: ["create", "update"],
    ...adminAc.statements, 
});
 
export const customOwnerAc = ac.newRole({ 
    project: ["create", "update", "delete"], 
    ...ownerAc.statements,
}); 
 
export const patientAc = ac.newRole({ 
    project: ["create"], 
}); 