import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../interfaces/RootState";
import { setCategory } from "../../../store/slices/quizSlice";

interface CategoryProps {
    categoryCallback?: Function;
}

function Category({ categoryCallback }: CategoryProps) {
    const dispatch = useDispatch();
    const quizState = useSelector((state: RootState) => state.quizDetails);

    const handleCategory = (category: string): void => {
        dispatch(setCategory(category));
        categoryCallback?.(category);
    };
    return (
        <div className="form-group">
            <div className="form-group-entity">
                <label
                    className={`style-primary ${quizState.category === "9" ? "active" : ""}`}
                    htmlFor="category-1"
                    onClick={(e) => handleCategory("9")}
                >
                    Random Category 1
                </label>
                <input type="radio" name="category" id="category-1" />
            </div>

            <div className="form-group-entity">
                <label
                    className={`style-primary ${quizState.category === "10" ? "active" : ""}`}
                    htmlFor="category-2"
                    onClick={(e) => handleCategory("10")}
                >
                    Random Category 2
                </label>
                <input type="radio" name="category" id="category-2" />
            </div>

            <div className="form-group-entity">
                <label
                    className={`style-primary ${quizState.category === "11" ? "active" : ""}`}
                    htmlFor="category-3"
                    onClick={(e) => handleCategory("11")}
                >
                    Random Category 3
                </label>
                <input type="radio" name="category" id="category-3" />
            </div>
        </div>
    );
}

export default Category;
