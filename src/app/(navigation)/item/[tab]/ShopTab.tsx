"use client";
import React, { useEffect, useState } from "react";
import CardShop from "@/app/component/Card/CardShop/CardShop";
import { useItemStore } from "@/store/itemStore";
import getAllItems from "@/lib/item-endpoint/getAllItem";
import Modal from "@/app/component/Modal/Modal";

const ShopTab: React.FC = () => {
    const { items, setItems } = useItemStore();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    useEffect(() => {
        getAllItems().then((fetchedItems) => {
            const sortedItems = fetchedItems.sort((a: any, b: any) => {
                if (a.quantity === 0 && b.quantity !== 0) return 1;
                if (a.quantity !== 0 && b.quantity === 0) return -1;
                return 0;
            });
            setItems(sortedItems);
        });
    }, [setItems]);

    const handleItemClick = (item: any) => {
        setSelectedItem(item);
        setIsConfirmationOpen(true);
    };

    const handleConfirmPurchase = () => {
        // Logic to handle purchase confirmation
        console.log("Confirm purchase:", selectedItem);
        // Perform actual purchase logic here
        setIsConfirmationOpen(false);
        setSelectedItem(null); // Reset selected item after purchase
    };

    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
        setSelectedItem(null); // Reset selected item if cancelled
    };

    return (
        <section className="shop-wrapper">
            <section className="shop-container">
                {items.map((item) => (
                    <CardShop
                        key={item.itemID}
                        imgSrc={`/assets/images/reward/${item.imagePath}`}
                        title={item.itemName}
                        price={item.itemPrice}
                        onClick={() => handleItemClick(item)}
                    />
                ))}
            </section>
            <Modal
                title="Confirm Purchase"
                details={`Do you want to purchase ${selectedItem?.itemName} for ${selectedItem?.itemPrice} credits?`}
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                buttons={[
                    <button key="cancel" onClick={handleCloseConfirmation}>
                        Cancel
                    </button>,
                    <button key="confirm" onClick={handleConfirmPurchase}>
                        Confirm
                    </button>,
                ]}
            />
        </section>
    );
};

export default ShopTab;
