// ShopTab.tsx
"use client";
import React, { useEffect, useState } from "react";
import CardShop from "@/app/component/Card/CardShop/CardShop";
import { useItemStore } from "@/store/itemStore";
import getAllItems from "@/lib/item-endpoint/getAllItem";
import Modal from "@/app/component/Modal/Modal";
import useProgressDashboardStore from "@/store/progressDashboardStore";
import useBuyItem from "@/hook/useBuyItem";

interface Item {
    itemID: number;
    itemName: string;
    imagePath: string;
    itemDescription: string;
    itemPrice: number;
    quantity: number;
}

const ShopTab: React.FC = () => {
    const { items, setItems } = useItemStore();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isInsufficientBalanceOpen, setIsInsufficientBalanceOpen] =
        useState(false);
    const [purchasedItemName, setPurchasedItemName] = useState<string | null>(
        null
    );
    const { buyItem } = useBuyItem();
    const { progressDashboard, setCreditAmount } = useProgressDashboardStore();
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const fetchedItems = await getAllItems();
                const sortedItems = fetchedItems.sort((a: Item, b: Item) => {
                    if (a.quantity === 0 && b.quantity !== 0) return 1;
                    if (a.quantity !== 0 && b.quantity === 0) return -1;
                    return 0;
                });
                setItems(sortedItems);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching items
            }
        };

        fetchItems();
    }, [setItems]);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setIsConfirmationOpen(true);
    };

    const handleConfirmPurchase = async () => {
        if (selectedItem) {
            if (progressDashboard.creditAmount < selectedItem.itemPrice) {
                setIsInsufficientBalanceOpen(true);
                setIsConfirmationOpen(false);
                return;
            }

            try {
                const purchaseResult = await buyItem(selectedItem.itemID);
                console.log("Purchase successful:", purchaseResult);

                const updatedItems = items.map((item) =>
                    item.itemID === selectedItem.itemID
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
                setItems(updatedItems);

                setCreditAmount(
                    progressDashboard.creditAmount - selectedItem.itemPrice
                );

                setPurchasedItemName(selectedItem.itemName);
                setIsSuccessOpen(true);
            } catch (error) {
                console.error("Purchase failed:", error);
            }
            setIsConfirmationOpen(false);
            setSelectedItem(null);
        }
    };

    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
        setSelectedItem(null);
    };

    const handleCloseSuccess = () => {
        setIsSuccessOpen(false);
        setPurchasedItemName(null);
    };

    const handleCloseInsufficientBalance = () => {
        setIsInsufficientBalanceOpen(false);
    };

    if (loading) {
        // return <Loading />; // Render Loading component while data is being loaded
        return <div>Loading...</div>;
    }

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
                className="modal-confirmation"
                buttons={[
                    <button
                        key="cancel"
                        className="btn-cancel"
                        onClick={handleCloseConfirmation}
                    >
                        Cancel
                    </button>,
                    <button
                        key="confirm"
                        className="btn-confirm"
                        onClick={handleConfirmPurchase}
                    >
                        Confirm
                    </button>,
                ]}
            />
            <Modal
                title="Purchase Successful"
                details={`You have successfully purchased ${purchasedItemName}!`}
                isOpen={isSuccessOpen}
                onClose={handleCloseSuccess}
                className="modal-success"
                buttons={[
                    <button
                        key="ok"
                        className="btn-ok"
                        onClick={handleCloseSuccess}
                    >
                        OK
                    </button>,
                ]}
            />
            <Modal
                title="Insufficient Balance"
                details={`You do not have enough credits to purchase ${selectedItem?.itemName}.`}
                isOpen={isInsufficientBalanceOpen}
                onClose={handleCloseInsufficientBalance}
                className="modal-insufficient-balance"
                buttons={[
                    <button
                        key="ok"
                        className="btn-ok"
                        onClick={handleCloseInsufficientBalance}
                    >
                        OK
                    </button>,
                ]}
            />
        </section>
    );
};

export default ShopTab;
