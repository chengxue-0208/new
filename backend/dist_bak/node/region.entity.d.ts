import { Node } from './node.entity';
export declare class Region {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    city: string;
    continent: string;
    networkType: 'public' | 'private';
    protocol: 'tcp' | 'udp';
    maxUsers: number;
    currentUsers: number;
    nodes: Node[];
    createdAt: Date;
    updatedAt: Date;
}
