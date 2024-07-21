// InventoryTab.tsx
import React, { useEffect, useState } from "react";
import CardInventory from "@/app/component/Card/CardInventory/CardInventory";
import { useRouter, usePathname } from "next/navigation";
import { useItemStore } from "@/store/itemStore";
import getAllItems from "@/lib/item-endpoint/getAllItem";

const InventoryTab: React.FC = () => {
    const { items, setItems } = useItemStore();
    const router = useRouter();
    const pathname = usePathname();
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
        getAllItems().then((fetchedItems) => {
            // Sort items so those with quantity 0 are at the bottom
            const sortedItems = fetchedItems.sort((a: any, b: any) => {
                if (a.quantity === 0 && b.quantity !== 0) return 1;
                if (a.quantity !== 0 && b.quantity === 0) return -1;
                return 0;
            });
            setItems(sortedItems);
        });
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
