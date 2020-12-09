import {userReducer} from "./user-reducer";

test('user reducer should change name of user', () => {
    const startState = { name: 'Dimych', age: 20, childrenCount: 2 };
    const newName = 'Viktor';
    const endState = userReducer(startState, { type: 'CHANGE-NAME', name: newName })
    console.log(endState)
    expect(endState.name).toBe(newName);
});
