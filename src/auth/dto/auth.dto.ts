export class AuthDto {
    username: string;
    password: string;
    originType: string;
}

export const userRole: Record<string, string[]> = {
    BackOfficeRole: ["RESPONSABLE_DEPARTEMENT", "ENSEIGNANT", "RESPONSABLE_PEDAGOGIQUE", "CHEF_DEPARTEMENT", "MEMBRE_EQUIPE_PEDAGOGIQUE", "MEMBRE_COMMISSION_PEDAGOGIQUE", "DIRECTEUR_ETUDES"],
    FrontOfficeRole: ["ETUDIANT", "ETUDIANT_RESPONSABLE", "ENSEIGNANT"],
};