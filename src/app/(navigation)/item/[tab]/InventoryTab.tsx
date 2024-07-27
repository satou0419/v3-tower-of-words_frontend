// InventoryTab.tsx
import React, { useEffect, useState } from "react";
import CardInventory from "@/app/component/Card/CardInventory/CardInventory";
import { useRouter, usePathname } from "next/navigation";
import { useItemStore } from "@/store/itemStore";
import getAllItems from "@/lib/item-endpoint/getAllItem";
import Loading from "@/app/loading"; // Import the Loading component

const InventoryTab: React.FC = () => {
    const { items, setItems } = useItemStore();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedItem, setSelectedItem] = useState<{
        name: string | null;
        description: string | null;
        banner: string | null;
    }>({
        name: null,
        description: null,
        banner: null,
    });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const fetchedItems = await getAllItems();
                // Sort items so those with quantity 0 are at the bottom
                const sortedItems = fetchedItems.sort((a: any, b: any) => {
                    if (a.quantity === 0 && b.quantity !== 0) return 1;
                    if (a.quantity !== 0 && b.quantity === 0) return -1;
                    return 0;
                });
                setItems(sortedItems);

                // Set the first item as the selected item
                if (sortedItems.length > 0) {
                    setSelectedItem({
                        name: sortedItems[0].itemName,
                        description: sortedItems[0].itemDescription,
                        banner: `/assets/images/reward/${sortedItems[0].imagePath}`,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch items:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching items
            }
        };

        fetchItems();
    }, [setItems]);

    useEffect(() => {
        const currentPathSegments = pathname.split("/");
        const currentTab =
            currentPathSegments.length > 2
                ? currentPathSegments[2]
                : "inventory";
        router.push(`/item/${currentTab}`);
    }, [pathname, router]);

    const handleItemClick = (item: any) => {
        setSelectedItem({
            name: item.itemName,
            description: item.itemDescription,
            banner: `/assets/images/reward/${item.imagePath}`,
        });
    };

    if (loading) {
        return <div>Loading...</div>;

        // return <Loading />; // Render Loading component while data is being loaded
    }

    return (
        <section className="inventory_wrapper">
            <section className="inventory-item">
                <section className="inventory-list">
                    {items.map((item) => (
                        <CardInventory
                            key={item.itemID}
                            className={`${
                                selectedItem.name === item.itemName
                                    ? "active"
                                    : ""
                            } ${item.quantity === 0 ? "grayscale" : ""}`}
                            imgSrc={`/assets/images/reward/${item.imagePath}`}
                            title={item.itemName}
                            description={item.itemDescription}
                            quantity={item.quantity}
                            onClick={() => handleItemClick(item)}
                        />
                    ))}
                </section>
            </section>
            <section className="inventory-item_detail">
                <section className="inventory-item_detail-container">
                    <section className="inventory-item_detail-banner">
                        {selectedItem.banner && (
                            <img
                                src={selectedItem.banner}
                                alt={selectedItem.name || ""}
                            />
                        )}
                    </section>
                    <section className="inventory-item_detail-container-description">
                        <h1>{selectedItem.name}</h1>
                        <span>{selectedItem.description}</span>
                    </section>
                </section>
            </section>
        </section>
    );
};

export default InventoryTab;
