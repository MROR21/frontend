import{create} from 'zustand';

export const useAppStore = create((set) => ({

    userId: localStorage.getItem('userId') || null,
    token: localStorage.getItem('token') || null,
    userName: localStorage.getItem('userName') || null, 
    tasks:[], isNewUser: false,

    setLogin: (Id, token, name, isNew = false) => {
        localStorage.setItem('userId', Id);
        localStorage.setItem('token', token);
        localStorage.setItem('userName', name);
        set({userId: Id, token: token, userName: name, isNewUser: isNew});
        
    },

    logout:() =>{
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        set({userId: null, token: null, userName: null, tasks: []});
    },

    setTasks:(newTasks) => {
        set({tasks: newTasks});
    },

    clearNewUserFlag: () => set({ isNewUser: false }),

}));