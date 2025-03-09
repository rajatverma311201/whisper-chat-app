"use client";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DeviceSelectorProps {
	label: string;
	devices: MediaDeviceInfo[];
	selectedDevice: string;
	onDeviceChange: (deviceId: string) => void;
}

export function DeviceSelector({
	label,
	devices,
	selectedDevice,
	onDeviceChange,
}: DeviceSelectorProps) {
	return (
		<div className="grid gap-2">
			<Label htmlFor={`${label.toLowerCase()}-select`}>{label}</Label>
			<Select value={selectedDevice} onValueChange={onDeviceChange}>
				<SelectTrigger id={`${label.toLowerCase()}-select`}>
					<SelectValue placeholder={`Select ${label}`} />
				</SelectTrigger>
				<SelectContent>
					{devices.length > 0 ? (
						devices.map((device) => (
							<SelectItem
								key={device.deviceId}
								value={device.deviceId}
							>
								{device.label ||
									`${label} ${devices.indexOf(device) + 1}`}
							</SelectItem>
						))
					) : (
						<SelectItem value="no-devices" disabled>
							No {label.toLowerCase()} devices found
						</SelectItem>
					)}
				</SelectContent>
			</Select>
		</div>
	);
}
