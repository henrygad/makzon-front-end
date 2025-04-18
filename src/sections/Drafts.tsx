import Displaydraft from "../components/Displaydraft";
import { useAppSelector } from "../redux";


const Drafts = () => {
    const { data: Drafts } = useAppSelector(state => state.userBlogpostSlices.drafts);

    return <section>
        <div className="space-y-6">
            {Drafts &&
                Drafts.length ?
                Drafts.map(draft =>
                    <Displaydraft
                        key={draft._id}
                        blogpost={draft}
                    />
                ):
                <span>No draft yet</span>
            }
        </div>
    </section>;
};

export default Drafts;
