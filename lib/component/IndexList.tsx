import React, { useEffect } from "react";
import { GoTriangleRight, GoTriangleDown } from "react-icons/go";

const IndexList: React.FunctionComponent<{
    open: boolean,
    text: string,
    listKey: string,
    onClick: (open: boolean) => void;
}> = ({
    open,
    text,
    children,
    listKey,
    onClick
}) => {
        return (
            <li key={listKey} className="cursor-pointer">
                <div className="flex" onClick={() => { onClick(open) }}>
                    {open
                        ? <GoTriangleDown className="my-auto" />
                        : <GoTriangleRight className="my-auto" />
                    }
                    <span className="ml-1">
                        {text}
                    </span>
                </div>
                <div className={`${!open && 'hidden'}`}>
                    {children}
                </div>
            </li>
        )
    };

export default IndexList;
