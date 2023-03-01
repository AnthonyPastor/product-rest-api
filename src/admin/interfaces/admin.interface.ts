export interface DashboardData {
	numberOfOrder: number;
	paidOrders: number; // isPaid true
	notPaidOrders: number;
	numberOfClients: number; // role: client
	numberOfProducts: number;
	productsWithNoInventory: number;
	productsWithLowInventory: number; // productos con 10 o menos
}
