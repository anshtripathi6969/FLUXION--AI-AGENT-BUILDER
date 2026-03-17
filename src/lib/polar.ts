import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: "sandbox",
});

// Intercept getStateExternal to swallow 404 ResourceNotFound errors.
// This prevents Better Auth from loudly logging 500 API errors when 
// a local user is missing from Polar (e.g. created during initial testing).
const originalGetStateExternal = polarClient.customers.getStateExternal.bind(polarClient.customers);

polarClient.customers.getStateExternal = async (args: any, options?: any) => {
    try {
        return await originalGetStateExternal(args, options);
    } catch (error: any) {
        const errorString = error?.message || JSON.stringify(error) || "";
        if (error?.status === 404 || errorString.includes("ResourceNotFound") || error?.name === "ResourceNotFound") {
            // Return an empty state representation to satisfy the getter gracefully
            return {
                activeSubscriptions: [],
                customer: { id: "not_found", email: "not_found@example.com", createdAt: new Date().toISOString() },
                grant: [],
            } as any;
        }
        throw error; // Re-throw any other actual API/Token errors
    }
};