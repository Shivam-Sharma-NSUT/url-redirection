import CreateLink from "@/components/CreateLink"
import UniversalLinks from "@/components/UniversalLinks"

const HomePage = () => {
  return (
    <div className="flex-1">
      <p className="text-2xl my-5">Home</p>
      <main className="flex flex-col gap-2">
        <CreateLink />
        <UniversalLinks />
      </main>
    </div>
  )
}

export default HomePage