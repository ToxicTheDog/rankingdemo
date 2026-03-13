// src/lib/testData.ts

export const TEST_TOKEN = "dev-test-mode-token-987654321-this-is-only-for-local-dev";

export const testUser = {
    id: "dev-test-0001",
    username: "Test Developer",
    email: "dev@test.local",
    role: "admin",
    fullName: "Test Developer",
    name: "Test Developer",
    imageUrl: "https://i.pravatar.cc/150?u=dev"
};

export const testRankingsMe = {
    totalPoints: 12450,
    referralCount: 87,
    availablePayout: 245000,
    affiliateLink: "AFF-TEST9X7K2M",
    fullName: "Test Developer",
    email: "dev@test.local",
    imageUrl: "https://i.pravatar.cc/150?u=dev"
};

export const testDashboardStats = {
    totalRevenue: 2450000,
    totalPayout: 1780000,
    profit: 670000,
    revenueChange: 12.5,
    payoutChange: 5.2,
    profitChange: 18.3,
    totalClients: 45,
    deactivated: 5,
    expelled: 2
};

export const testAffiliates = [
    {
        id: "123456789012345",
        user: "Marko Petrović",
        email: "marko@example.com",
        link: "AFF-9Q4K2M",
        linkCreated: "2025-01-15",
        lastInvite: "2025-03-10",
        invited: 47,
        totalPoints: 12450,
        rank: {
            name: "Diamond",
            bonus: 25
        },
        status: "active",
        commissionRate: 15,
        imageUrl: "https://i.pravatar.cc/150?u=marko"
    },
    {
        id: "987654321098765",
        user: "Ana Jovanović",
        email: "ana@example.com",
        link: "AFF-X7K9P2",
        linkCreated: "2025-02-03",
        lastInvite: "2025-03-08",
        invited: 32,
        totalPoints: 8750,
        rank: {
            name: "Gold",
            bonus: 18
        },
        status: "active",
        commissionRate: 12,
        imageUrl: "https://i.pravatar.cc/150?u=ana"
    },
    {
        id: "555555555555555",
        user: "Stefan Nikolić",
        email: "stefan@example.com",
        link: "AFF-TEST123",
        linkCreated: "2025-01-20",
        lastInvite: "2025-02-28",
        invited: 19,
        totalPoints: 4320,
        rank: {
            name: "Silver",
            bonus: 10
        },
        status: "pending",
        commissionRate: 8,
        imageUrl: "https://i.pravatar.cc/150?u=stefan"
    },
    {
        id: "111111111111111",
        user: "Jelena Petrović",
        email: "jelena@example.com",
        link: "AFF-4K8M2P",
        linkCreated: "2024-12-10",
        lastInvite: "2025-03-01",
        invited: 8,
        totalPoints: 2150,
        rank: {
            name: "Bronze",
            bonus: 5
        },
        status: "active",
        commissionRate: 5,
        imageUrl: "https://i.pravatar.cc/150?u=jelena"
    }
];