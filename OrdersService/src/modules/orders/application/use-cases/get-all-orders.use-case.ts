//caso de uso para obtener todas las órdenes
import { OrderRepositoryInterface } from "../../domain/interfaces/order.interface";
import { OrderEntity } from "../../domain/entities/order.entity";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class GetAllOrdersUseCase {
    constructor(
        @Inject('OrderRepositoryInterface')
        private readonly orderRepository: OrderRepositoryInterface
    ) {}

    async execute(): Promise<OrderEntity[]> {
        return await this.orderRepository.findAll();
    }
}
