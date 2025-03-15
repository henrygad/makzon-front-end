import Displaydraft from "../components/Displaydraft";
import { useAppSelector } from "../redux";


const Drafts = () => {
    const { data: Drafts } = useAppSelector(state => state.userBlogpostSlices.drafts);

    return <div>
        <div className="space-y-6">
            {Drafts &&
                Drafts.length ?
                Drafts.map(draft =>
                    <Displaydraft
                        key={draft._id}
                        blogpost={draft}
                    />
                ) :
                <span>No draft yet</span>
            }
        </div>
    </div>;
};

export default Drafts;
