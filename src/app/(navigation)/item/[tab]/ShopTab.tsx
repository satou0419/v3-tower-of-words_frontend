// ShopTab.tsx
import React, { useEffect } from "react";
import CardShop from "@/app/component/Card/CardShop/CardShop";
import { useItemStore } from "@/store/itemStore";
import getAllItems from "@/lib/item-endpoint/getAllItem";

const ShopTab: React.FC = () => {
    const { items, setItems } = useItemStore();

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

    const handleClick = () => {
        console.log("Click");
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
                        onClick={handleClick}
                    />
                ))}
            </section>
        </section>
    );
};

export default ShopTab;
