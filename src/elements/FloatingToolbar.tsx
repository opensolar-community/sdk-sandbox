import React from "react";

const FloatingToolbar = ({ ossdk, selected, system }) => (
    <div
        id="sdk-ui-overlay"
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            pointerEvents: "none",
        }}
    >
        <div
            style={{
                position: "absolute",
                backgroundColor: "#CCFFFF",
                width: "200px",
                top: 50,
                right: 200,
                boxShadow: "0px 0px 5px rgba(1,1,1,0.5)",
                pointerEvents: "all",
            }}
        >
            <div style={{ margin: 10 }}>
                <div>Floating Toolbar</div>
                <div style={{ marginTop: 10 }}>Selected Object</div>
                <textarea
                    aria-multiline="true"
                    value={JSON.stringify(selected)}
                    readOnly
                    style={{ width: "100%", height: 100, fontSize: 10 }}
                />

                {system && (
                    <div>
                        <div>System Size: {Math.round(1000 * (system?.userData?.kwStc || 0)) / 1000} kW</div>
                        <div>Solar Panels: {system?.userData?.moduleQuantity || 0} panels</div>
                        <div>Production: {Math.round(system?.userData?.output?.annual || 0)} kWh/yr</div>
                        <div>Offset: {Math.round(system?.userData?.consumption?.consumption_offset_percentage || 0)} %</div>
                        <div>
                            Arrays:{" "}
                            {(system?.userData?.inverters?.length || 0) +
                                (system?.userData?.unstrungModulesByModuleGrid?.length || 0)}{" "}
                            Arrays
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);


export default FloatingToolbar