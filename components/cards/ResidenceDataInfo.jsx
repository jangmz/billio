import { formatDate, formatDateWithTime } from "@/config/formatDate";
import Image from "next/image";

export default function ResidenceDataInfo({ srcImg, altImg, wImg, hImg, residence }) {
    return (
        <div className="card lg:card-side bg-base-200 shadow-md">
            <figure className="lg:w-1/3">
                <Image
                    src={srcImg}
                    alt={altImg}
                    width={wImg}
                    height={hImg}
                    className="rounded-l-xl object-cover w-full h-full"
                />
            </figure>
            <div className="card-body lg:w-2/3">
                <h1 className="card-title text-3xl font-bold">{residence.name}</h1>
                <p className="text-sm text-gray-500">Address: {residence.address}</p>
                <p className="text-sm text-gray-500">Created: {formatDate(residence.createdAt)}</p>
                <p className="text-sm text-gray-500">Last updated: {formatDateWithTime(residence.updatedAt)}</p>
            </div>
        </div>
    )
}
