import { takeLatest, debounce, retry, put, spawn, call } from "redux-saga/effects";
import { searchSkillsRequest, searchSkillsSuccess, searchSkillsFailure } from "../actions/actionCreators";
import {
  CHANGE_SEARCH_FIELD,
  SEARCH_SKILLS_REQUEST,
} from "../actions/actionTypes";
import SearchSkills from "../components/SearchSkills";

let fetchRequestControllers: AbortController[] = [];

function filterChangeSearchAction({ type, payload }) {
    // return type === CHANGE_SEARCH_FIELD && payload.search.trim() !== '';
    return type === CHANGE_SEARCH_FIELD;
}

function* handleChangeSearchSaga({ type, payload }) {
    let searchEmptyValue = payload.search === '';
   
    if (searchEmptyValue) {
        fetchRequestControllers.forEach((controller) => {
            controller.abort();
        });
        
        yield put(searchSkillsSuccess([]));  
    } else {
        yield put(searchSkillsRequest(payload.search));
    }
}

function* handleSearchSkillsSaga(action: any) {

    try {
        const controller = new AbortController();
        const signal = controller.signal;

        const retryCount = 3;
        const retryDelay = 1 * 1000;
        const data = yield retry(
            retryCount,
            retryDelay,
            SearchSkills,
            action.payload.search,
            signal
        );

        fetchRequestControllers.push(controller);
        
        yield put(searchSkillsSuccess(data));
    } catch (e) {
        yield put(searchSkillsFailure(e.message));
    }
}

function* watchChangeSearchSaga() {
    yield debounce(300, filterChangeSearchAction, handleChangeSearchSaga);
}

function* watchSearchSkillsSaga() {
    yield takeLatest(SEARCH_SKILLS_REQUEST, handleSearchSkillsSaga);
}

export default function* saga() {
    yield spawn(watchChangeSearchSaga);
    yield spawn(watchSearchSkillsSaga);
}