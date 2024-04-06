export class AuthDto {
    username: string;
    password: string;
    type: string;
}

export const userRole: Record<string, string[]> = {
    BackOfficeRole: ["RESPONSABLE_DEPARTEMENT", "ENSEIGNANT"],
    FrontOfficeRole: ["ETUDIANT", "ETUDIANT_RESPONSABLE"],
};