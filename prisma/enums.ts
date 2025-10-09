export enum RoleUtilisateur {
    CLIENT = "client",
    ADMIN = "admin",
    GUIDE = "guide",
}

export enum StatutReservation {
    EN_ATTENTE = "en_attente",
    CONFIRMEE = "confirmee",
    ANNULEE = "annulee",
    TERMINEE = "terminee",
}

export enum StatutGuide {
    LOCAL = "local",
    PRO = "pro",
}

export enum VerificationStatus {
    EN_ATTENTE = "en_attente",
    AUTHENTIFIE = "authentifié",
    REJETE = "rejeté",
}

export enum StatutBoost {
    ACTIVE = "active",
    EXPIREE = "expirée",
}

export enum StatutDisponibilite {
    DISPONIBLE = "disponible",
    INDISPONIBLE = "indisponible",
    BLOQUE = "bloqué",
}

export enum TypeDocument {
    CV = "CV",
    DIPLOME = "diplôme",
    JUSTIFICATIF_DOMICILE = "justificatif_de_domicile",
}

export enum TypeMedia {
    PHOTO = "photo",
    VIDEO = "video",
    DOCUMENT = "document",
    AUDIO = "audio",
}

export enum StatutPaiement {
    EN_ATTENTE = "en_attente",
    EFFECTUE = "effectué",
    REMBOURSE = "remboursé",
}

export enum StatutLitige {
    OUVERT = "ouvert",
    EN_ATTENTE = "en_attente",
    RESOLU = "résolu",
    REFUSE = "refusé",
}

export enum TypeAbonnement {
    LOCO_PLUS = "loco_plus",
    STANDARD = "standard",
}

export enum StatutSupportTicket {
    OUVERT = "ouvert",
    EN_COURS = "en_cours",
    FERME = "fermé",
}

export enum TypeNotification {
    RAPPEL_RESERVATION = "rappel_reservation",
    NOUVEAU_MESSAGE = "nouveau_message",
}