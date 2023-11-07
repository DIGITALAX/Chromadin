import { FunctionComponent } from "react";
import { ShippingInfoProps } from "../types/interactions.types";
import { setFulfillmentDetails } from "@/redux/reducers/fulfillmentDetailsSlice";

const ShippingInfo: FunctionComponent<ShippingInfoProps> = ({
  fulfillmentDetails,
  dispatch,
  hideImage
}): JSX.Element => {
  return (
    <div className={`relative h-fit flex flex-col gap-3 items-center justify-center ${
      !hideImage ? "px-3 w-fit" : "w-3/4"
    }`}>
      <div className="relative flex flex-col w-full h-fit justify-center items-center gap-3">
        <div className="relative w-full flex flex-col preG:flex-row gap-3 items-center justify-center">
          <input
            placeholder="name"
            className={`bg-black border h-8 border-white p-1.5 rounded-md font-earl text-white text-xs w-full ${
              !hideImage && "preG:w-auto"
            }`}
            value={fulfillmentDetails?.name}
            onChange={(e) =>
              dispatch(
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  name: e.target.value,
                })
              )
            }
          />
          <input
            placeholder="email, lens, tumblr"
            className={`bg-black border border-white p-1.5 rounded-md font-earl text-white h-8 text-xs w-full ${
              !hideImage && "preG:w-auto"
            }`}
            value={fulfillmentDetails?.contact}
            onChange={(e) =>
              dispatch(
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  contact: e.target.value,
                })
              )
            }
          />
        </div>
        <input
          placeholder="address"
          className="bg-black border border-white p-1.5 rounded-md font-earl text-white w-full h-8 text-xs"
          value={fulfillmentDetails?.address}
          onChange={(e) =>
            dispatch(
              setFulfillmentDetails({
                ...fulfillmentDetails,
                address: e.target.value,
              })
            )
          }
        />
        <div className="relative w-full h-fit flex flex-col preG:flex-row gap-3 items-center justify-center">
          <input
            placeholder="zip"
            className="bg-black border border-white p-1.5 rounded-md font-earl w-full text-white text-xs h-8"
            value={fulfillmentDetails?.zip}
            onChange={(e) =>
              dispatch(
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  zip: e.target.value,
                })
              )
            }
          />
          <input
            placeholder="city"
            className="bg-black border border-white p-1.5 rounded-md font-earl w-full text-white text-xs h-8"
            value={fulfillmentDetails?.city}
            onChange={(e) =>
              dispatch(
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  city: e.target.value,
                })
              )
            }
          />
        </div>
        <div className="relative w-full h-fit flex flex-col preG:flex-row gap-3 items-center justify-center">
          <input
            placeholder="state"
            className="bg-black border border-white p-1.5 rounded-md font-earl w-full text-white text-xs  h-8"
            value={fulfillmentDetails?.state}
            onChange={(e) =>
              dispatch(
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  state: e.target.value,
                })
              )
            }
          />
          <input
            placeholder="country"
            className="bg-black border border-white p-1.5 rounded-md font-earl w-full text-white text-xs h-8"
            value={fulfillmentDetails?.country}
            onChange={(e) =>
              dispatch(
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  country: e.target.value,
                })
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
