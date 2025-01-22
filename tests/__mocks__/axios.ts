
const axios = {

    get: jest.fn((request: Request) => Promise.resolve({ 
        data: { user: { id: 1, name: 'test 1' }}, 
        requested: request,
        status: 'received', 
    })),
    post: jest.fn((request: Request) => Promise.resolve({ 
        data: { user: { id: 2, name: 'test 2' }}, 
        requested: request,
        status: 'created', 
    })),
    put: jest.fn((request: Request) => Promise.resolve({ 
        data: { user: { id: 2, name: 'test 3' }}, 
        requested: request,
        status: 'updated', 
    })),
    delete: jest.fn((request: Request) => Promise.resolve({ 
        data: { }, 
        requested: request,
        status: 'deleted', 
    })),

};

export default axios;
