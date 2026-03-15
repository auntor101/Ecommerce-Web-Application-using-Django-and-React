export const isFrontendOnlyMode = !process.env.REACT_APP_API_URL

export const frontendOnlyMessage = 'Frontend demo mode is active. Backend features are disabled in this deployment.'