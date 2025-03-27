"use client";

import { FaCheck, FaXmark } from "react-icons/fa6";
import { FaDotCircle } from "react-icons/fa";

/*
    This component accepts title, color (green, red, gray) and array of strings (properties) to be displayed.
    Default color is yellow.
*/

export default function ColoredCard({ title, color, propertiesArr }) {

    function getColorClasses(color) {
        switch (color) {
            case "red":
                return "border-red-600 bg-red-500/20";
            case "green":
                return "border-green-600 bg-green-500/20";
            case "gray":
                return "border-gray-600 bg-gray-500/20";
            default:
                return "border-yellow-600 bg-yellow-500/20";
        };
    }

    function getTextColor(color) {
        switch (color) {
            case "red":
                return "text-red-800";
            case "green":
                return "text-green-800";
            case "gray":
                return "text-gray-800";
            default:
                return "text-yellow-800";
        };
    }
    
    return (
      <div className={`card card-xl rounded-box w-96 border-2 ${getColorClasses(color)}`}>
          <div className="card-body">
              <h2 className="card-title text-2xl text-center block uppercase">
                  {title}
              </h2>
              { propertiesArr &&
                <ul>
                    {
                        propertiesArr.map((property, index) => (
                            <li key={index} className="py-2">
                                <div className="flex items-center gap-2">
                                    {color === "green" && <FaCheck className={getTextColor(color)} />}
                                    {color === "red" && <FaXmark className={getTextColor(color)} />}
                                    {color !== "green" && color !== "red" && <FaDotCircle className={getTextColor(color)} />}
                                    <span className={getTextColor(color)}>{property}</span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
              }
          </div>
      </div>
    )
  }
  