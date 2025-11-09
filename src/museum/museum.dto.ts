/* eslint-disable prettier/prettier */
import {IsInt, IsNotEmpty, IsString, IsUrl, Min} from 'class-validator';
export class MuseumDto {

 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @IsString()
 @IsNotEmpty()
 readonly description: string;
 
 @IsString()
 @IsNotEmpty()
 readonly address: string;
 
 @IsString()
 @IsNotEmpty()
 readonly city: string;
 
 @IsUrl()
 @IsNotEmpty()
 readonly image: string;

@IsInt()
@Min(1000) 
@IsNotEmpty()
readonly foundedBefore: number;
}
/* archivo: src/museum/museum.dto.ts */