import React, { useEffect, useState } from "react"
import CardInventory from "@/app/component/Card/CardInventory/CardInventory"
import { useRouter, usePathname } from "next/navigation"
import { useItemStore } from "@/store/itemStore"
import getAllItems from "@/lib/item-endpoint/getAllItem"

const ItemsTab: React.FC = () => {
    const { items, setItems } = useItemStore()
    const router = useRouter()
    const pathname = usePathname()
    const [selectedItem, setSelectedItem] = useState<{
        name: string | null
        description: string | null
        banner: string | null
    }>({
        name: null,
        description: null,
        banner: null,
    })

    // Fetch items and set default selection (first item if available)
    useEffect(() => {
        getAllItems().then((fetchedItems) => {
            // Sort items so those with quantity 0 are at the bottom
            const sortedItems = fetchedItems.sort((a: any, b: any) => {
                if (a.quantity === 0 && b.quantity !== 0) return 1
                if (a.quantity !== 0 && b.quantity === 0) return -1
                return 0
            })
            setItems(sortedItems)

            // Set default selected item if there are items available
            if (sortedItems.length > 0) {
                const defaultItem = sortedItems[0] // Choose first item as default
                setSelectedItem({
                    name: defaultItem.itemName,
                    description: defaultItem.itemDescription,
                    banner: `/assets/images/reward/${defaultItem.imagePath}`,
                })
            }
        })
    }, [setItems])

    // Update the router when the pathname changes
    useEffect(() => {
        const currentPathSegments = pathname.split("/")
        const currentTab =
            currentPathSegments.length > 2 ? currentPathSegments[2] : "items"
        router.push(`/inventory/${currentTab}`)
    }, [pathname, router])

    const handleItemClick = (item: any) => {
        setSelectedItem({
            name: item.itemName,
            description: item.itemDescription,
            banner: `/assets/images/reward/${item.imagePath}`,
        })
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
                        {selectedItem.banner && selectedItem.name ? (
                            <img
                                src={selectedItem.banner}
                                alt={selectedItem.name || ""}
                            />
                        ) : (
                            <div className="placeholder-message">
                                Select an item
                            </div>
                        )}
                    </section>
                    <section className="inventory-item_detail-container-description">
                        <h2>{selectedItem.name}</h2>
                        <span>{selectedItem.description}</span>
                    </section>
                </section>
            </section>
        </section>
    )
}

export default ItemsTab
