import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StartRatingFilter";
import HotelTypesFilter from "../components/HotelTypes";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();

  const [page, setPage] = useState<number>(1);
  const [selecedStarts, setSetlectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilites, setSelectedFacilites] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selecedStarts,
    types: selectedHotelTypes,
    facilities: selectedFacilites,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSetlectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevHotels) =>
      event.target.checked
        ? [...prevHotels, hotelType]
        : prevHotels.filter((star) => star !== hotelType)
    );
  };

  const handleFacilities = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;

    setSelectedFacilites((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((star) => star !== facility)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By:
          </h3>
          <StarRatingFilter
            selecedStarts={selecedStarts}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selecedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilites={selectedFacilites}
            onChange={handleFacilities}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (low to high)
            </option>
            <option value="pricePerNightDesc">
              Price Per Night (high to low)
            </option>
          </select>
        </div>
        {hotelData?.data.map((hotel) => (
          <SearchResultCard hotel={hotel} />
        ))}
        <div>
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
