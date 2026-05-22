import AddCompanyButton from './components/add-company-button';
import MagicButton from './components/magic-button';

export default function Home() {
    return (
        <div>
            <main className='container mx-auto p-4'>
                <h1>Welcome to Next.js!</h1>
                <AddCompanyButton />
                <MagicButton />
            </main>
        </div>
    );
}
