import Image from "next/image";

export default function AvatarImage({ src, width, height, alt, style }) {
    return (
        <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-16 rounded-full ring-2 ring-offset-2">
                <Image 
                    src={src} 
                    width={width} 
                    height={height} 
                    alt={alt} 
                    style={style}
                />
            </div>
        </div>
    )
}
