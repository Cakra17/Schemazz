import {
	Check,
	ChevronDown,
	CloudCheck,
	CodeXml,
	Crown,
	Database,
	FolderDown,
	FolderUp,
	GithubIcon,
	History,
	Import,
	Link2,
	Loader,
	Lock,
	Menu,
	Moon,
	Plus,
	PlusCircle,
	Search,
	Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./primitives/Button";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import VR from "./primitives/VerticalDivider";
import Hero from "./Hero";
import Avatar from "./primitives/Avatar";
import Logo from "./Logo";
import { AdvancedPopover } from "./primitives/Popover";
import { ListMenu, ListMenuItem } from "./primitives/Menu";

export default function EditorHeader() {
	return (
		<div className="dark jb">
			<></>
			<header className="relative z-100 bg-stone-900 border-b border-white/1 backdrop-blur-md">
				<div className="flex h-14 items-center justify-between mx-auto px-4 text-white sm:px-6 lg:px-4">
					<div className="flex h-full py-2 flex-row items-center gap-2">
						{/* <Link
              to={"/"}
              className="p-[6px] flex items-center text-2xl gap-1 pr-4"
            >
              <Database size={28} />
              <h1>Schemazz</h1>
            </Link> */}
						<Logo />
						<SyncAndHistoryButton />
						<input
							type="text"
							className="h-[36] outline-none focus:outline-none w-2xs flex items-center px-2 rounded-lg text-md font-normal ring-1 ring-slate-600 hover:ring-2 hover:ring-slate-400 focus:ring-slate-500 focus:ring-2 transition overflow-hidden"
							placeholder="Untitled Schema"
						/>
						<ShareButton />
						<Button variant="secondary" className="h-[36]">
							<FolderUp size={20} />
							Import
						</Button>
						<Button variant="secondary" className="h-[36]">
							<FolderDown size={20} />
							Export
						</Button>
					</div>

					<div className="flex h-full justify-center items-center mr-2 gap-2">
						<Button variant="secondary" className="h-[36] w-[36]">
							<Moon size={20} />
						</Button>
						<Button variant="secondary" className="h-[36]">
							<Crown size={20} />
							Upgrade to Pro
						</Button>
						<Avatar className="h-[36] w-[36] bg-blue-500" />
						{/* <Link
              to={"https://github.com/Cakra17/Schemazz"}
              target="_blank"
              className="p-[6px] rounded-md hover:bg-[#333]"
            >
              <GithubIcon className="w-5 h-5" />
            </Link> */}
					</div>
				</div>
			</header>
		</div>
	);
}

function SyncAndHistoryButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [cloudSyncing, setCloudSyncing] = useState(false);

	return (
		<AdvancedPopover
			trigger={
				<Button
					variant="plain"
					className={`p-2`}
					id="sync-button"
					data-tooltip-id="sync-button"
					data-tooltip-place="bottom"
					isActive={isOpen}
				>
					{cloudSyncing ? (
						<Loader size={20} className="animate-[spin_2s_linear_infinite]" />
					) : (
						<CloudCheck size={20} />
					)}
				</Button>
			}
			onOpenCallback={setIsOpen}
		>
			<div className="flex flex-col gap-2 text-sm p-6">
				<h1 className="font-bold">
					{cloudSyncing ? "Saving progress..." : "Changes synchronized"}
				</h1>
				<p className="text-stone-700 dark:text-stone-200">
					Last changes: just now
				</p>
				<hr className="text-slate-700 dark:text-slate-300 opacity-60 my-2" />
				<Button
					variant="secondary"
					className="py-1.5 px-4.5"
					onClick={() => {
						setCloudSyncing(true);
						setTimeout(() => setCloudSyncing(false), 2000);
					}}
				>
					<History />
					View history
				</Button>
			</div>
		</AdvancedPopover>
	);
}

type ShareMode = "Restricted" | "Password Protected" | "Public";
type SharerRole = "Viewer" | "Editor";

function ShareButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [savingShareSetting, setSavingShareSetting] = useState(false);
	const [shareMode, setShareMode] = useState<ShareMode>("Restricted");
	const [sharerRole, setSharerRole] = useState<SharerRole>("Viewer");

	const mockLoading = () => {
		setSavingShareSetting(true);
		setTimeout(() => setSavingShareSetting(false), 2000);
	};

	const shareModeDesc: Record<ShareMode, string> = {
		Restricted: "Only specific users",
		"Password Protected": "Anyone with the password",
		Public: "Anyone with the link",
	};

	return (
		<AdvancedPopover
			trigger={
				<Button
					variant="secondary"
					id="share-button"
					className="h-[36]"
					isActive={isOpen}
				>
					<Share2 size={20} />
					Share
				</Button>
			}
			onOpenCallback={setIsOpen}
		>
			<div className="flex flex-col gap-2 p-6">
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between items-end">
						<h2 className="font-bold text-md">Share diagram</h2>
						<h1 className="text-stone-700 dark:text-stone-200 text-sm">
							Not shared
						</h1>
					</div>

					<div className="flex flex-row gap-3">
						<input
							type="text"
							className={`
                flex-1 outline-none ring-1 ring-slate-600 rounded-md py-1 px-2 w-xs
                hover:dark:ring-slate-400 hover:ring-2 
                focus:dark:ring-slate-500 focus:ring-2
                transition-all duration-150 
                `}
							placeholder="Enter email to share with"
						/>
						<Button className="py-1.5 px-4.5">Invite</Button>
					</div>
				</div>
				<hr className="text-slate-700 dark:text-slate-300 opacity-60 my-2" />
				<div className="flex flex-col gap-6">
					<div className="flex flex-row gap-2 items-center">
						<div className="rounded-full ring-1 ring-stone-100 bg-stone-700 p-2">
							<Lock size={18} />
						</div>
						<div className="flex flex-1 flex-col gap-0.5 items-start">
							<AdvancedPopover
								trigger={
									<Button variant="plain" className="px-1.5 py-0.5">
										<h1 className="text-sm font-medium">{shareMode}</h1>
										<ChevronDown size={18} />
									</Button>
								}
							>
								<ListMenu>
									<ListMenuItem
										leadingContent={
											<Check
												className={
													shareMode === "Restricted" ? "" : "opacity-0"
												}
											/>
										}
										title="Restricted"
										onClick={() => setShareMode("Restricted")}
										description={shareModeDesc["Restricted"]}
									/>
									<ListMenuItem
										leadingContent={
											<Check
												className={
													shareMode === "Password Protected" ? "" : "opacity-0"
												}
											/>
										}
										title="Password protected"
										onClick={() => setShareMode("Password Protected")}
										description={shareModeDesc["Password Protected"]}
									/>
									<ListMenuItem
										leadingContent={
											<Check
												className={shareMode === "Public" ? "" : "opacity-0"}
											/>
										}
										title="Public"
										onClick={() => setShareMode("Public")}
										description={shareModeDesc["Public"]}
									/>
								</ListMenu>
							</AdvancedPopover>
							<p className="text-xs px-1.5 opacity-80">
								{shareModeDesc[shareMode]}
							</p>
						</div>
						<div className="w-[16]" />

						<AdvancedPopover
							trigger={
								<Button variant="plain" className="px-1.5 py-0.5">
									<h1 className="text-sm font-medium">{sharerRole}</h1>
									<ChevronDown size={18} />
								</Button>
							}
						>
							<ListMenu>
								<ListMenuItem
									leadingContent={
										<Check
											className={sharerRole === "Viewer" ? "" : "opacity-0"}
										/>
									}
									title="Viewer"
									onClick={() => setSharerRole("Viewer")}
								/>
								<ListMenuItem
									leadingContent={
										<Check
											className={sharerRole === "Editor" ? "" : "opacity-0"}
										/>
									}
									title="Editor"
									onClick={() => setSharerRole("Editor")}
								/>
							</ListMenu>
						</AdvancedPopover>
					</div>

					<div className="flex w-full flex-row gap-2 items-center">
						<Button variant="secondary">
							<CodeXml size={18} />
							Embed
						</Button>
						<Button variant="secondary">
							<Link2 size={18} />
							Copy link
						</Button>
						<div className="flex-1" />
					</div>
				</div>
			</div>
		</AdvancedPopover>
	);
}
