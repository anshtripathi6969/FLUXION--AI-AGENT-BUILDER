import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscription = () => {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const { data, error } = await authClient.customer.state();
            if (error) {
                // If the error relates to a missing customer in Polar, gracefully return an empty state
                if (JSON.stringify(error).includes("ResourceNotFound")) {
                    return { activeSubscriptions: [] };
                }
                console.error("Subscription fetch error:", error);
                throw error;
            }
            return data;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};

export const useHasActiveSubscription = () => {
    const { data: customerState, isLoading, ...rest } = useSubscription();

    const hasActiveSubscription =
        !!customerState?.activeSubscriptions?.length;

    console.log("Subscription State Debug:", {
        customerState,
        hasActiveSubscription,
        isLoading
    });

    return {
        hasActiveSubscription,
        subscription: customerState?.activeSubscriptions?.[0],
        isLoading,
        ...rest,
    };
};
