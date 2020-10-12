import axios from 'axios';

const IndexPage = ({ currentuser }) => {
    console.log(currentuser);
    return <h1>Index page</h1>;
}

IndexPage.getInitialProps = async () => {
    const response = await axios.get('/api/users/currentuser');
    return response.data;
};

export default IndexPage;