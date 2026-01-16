'use client'

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";  // Import the Lucide icons

const RedeemDateDropdown = ({ dates }) => {
    const [expanded, setExpanded] = useState(false);

    const toggle = () => setExpanded(!expanded);

    // Format date
    const expiryDateFun = (expiryDates) => {
        if (Array.isArray(expiryDates)) {
            return expiryDates.map(date =>
                new Date(date).toLocaleDateString('en-GB')
            ).join(', '); // Join the formatted dates with commas or line breaks
        } else {
            return new Date(expiryDates).toLocaleDateString('en-GB');
        }
    };

    return (
        <div>
            <div className="font-medium">
                {expiryDateFun(dates.slice(0, 2))}
                {!expanded && '...'}
            </div>
            {expanded && (
                <div className="text-sm mt-1">
                    {dates.slice(2).map((date, idx) => (
                        <div key={idx}>{new Date(date).toLocaleDateString('en-GB')}</div>
                    ))}
                </div>
            )}
            <button
                onClick={toggle}
                className="text-white text-xs underline mt-1 rounded flex items-center"
            >
                {expanded ? (
                    <>
                        <ChevronUp className="mr-1 text-black" size={14} />
                    </>
                ) : (
                    <>
                        <ChevronDown className="mr-1 text-black" size={14} />
                    </>
                )}
            </button>
        </div>
    );
};

export default RedeemDateDropdown;
