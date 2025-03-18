import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import Blog from './pages/Blog';
function App(){
  return(
<>
<BrowserRouter>
<Routes>
  <Route path="/Login" element={<Login/>}></Route>
  <Route path="/SignUp" element={<SignUp/>}></Route>
  <Route path="/blog" element={<Blog/>}></Route>
</Routes>
</BrowserRouter>
</>
  )
}
export default App;