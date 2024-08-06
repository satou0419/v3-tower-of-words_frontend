import "./loading.scss";

export default function Loading() {
    return (
        <div className="loading-overlay">
            <div className="loader">
                <div className="loader__balls">
                    <div className="loader__balls__group">
                        <div className="ball item1"></div>
                        <div className="ball item1"></div>
                        <div className="ball item1"></div>
                    </div>
                    <div className="loader__balls__group">
                        <div className="ball item2"></div>
                        <div className="ball item2"></div>
                        <div className="ball item2"></div>
                    </div>
                    <div className="loader__balls__group">
                        <div className="ball item3"></div>
                        <div className="ball item3"></div>
                        <div className="ball item3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
