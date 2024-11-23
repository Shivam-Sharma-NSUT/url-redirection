import CreateLink from "@/components/CreateLink"
import UniversalLinks from "@/components/UniversalLinks"

const HomePage = () => {
  return (
    <div className="p-4">
      <main className="flex flex-col gap-2">
        <CreateLink />
        <UniversalLinks />
      </main>
    </div>
  )
}

export default HomePage