// Role hierarchy levels (higher number = more permissions)
const ROLE_LEVELS = {
    Admin: 3,
    Manager: 2,
    Viewer: 1
};

/**
 * Check if a user role has permission to access a feature requiring a specific role
 * @param {string} userRole - The user's current role
 * @param {string} requiredRole - The minimum role required
 * @returns {boolean} - Whether the user has permission
 */
export const canAccessFeature = (userRole, requiredRole) => {
    const userLevel = ROLE_LEVELS[userRole] || 0;
    const requiredLevel = ROLE_LEVELS[requiredRole] || 0;
    return userLevel >= requiredLevel;
};

/**
 * Check if user can send campaigns
 */
export const canSendCampaign = (userRole) => {
    return canAccessFeature(userRole, 'Manager');
};

/**
 * Check if user can manage contacts
 */
export const canManageContacts = (userRole) => {
    return canAccessFeature(userRole, 'Manager');
};

/**
 * Check if user can manage users (Admin only)
 */
export const canManageUsers = (userRole) => {
    return userRole === 'Admin';
};

/**
 * Check if user can view campaign stats
 */
export const canViewStats = (userRole) => {
    return canAccessFeature(userRole, 'Viewer');
};

/**
 * Get all permissions for a given role
 */
export const getRolePermissions = (role) => {
    return {
        canSendCampaign: canSendCampaign(role),
        canManageContacts: canManageContacts(role),
        canManageUsers: canManageUsers(role),
        canViewStats: canViewStats(role)
    };
};
