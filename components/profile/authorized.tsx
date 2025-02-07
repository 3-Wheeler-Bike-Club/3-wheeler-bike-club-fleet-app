import { Profile } from "./profile";

export function Authorized() {
    return (
        <main className="flex flex-col w-full h-full items-center gap-8 p-24 max-md:p-6">
            <Profile/>
        </main>
    );
}
