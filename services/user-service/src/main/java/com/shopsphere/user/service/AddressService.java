package com.shopsphere.user.service;

import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.user.dto.AddressDto;
import com.shopsphere.user.entity.Address;
import com.shopsphere.user.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(UUID userId) {
        return addressRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(UUID userId, AddressDto dto) {
        if (dto.isDefaultShipping()) {
            clearDefaultShipping(userId);
        }
        if (dto.isDefaultBilling()) {
            clearDefaultBilling(userId);
        }

        Address address = Address.builder()
                .userId(userId)
                .recipientName(dto.getRecipientName())
                .street(dto.getStreet())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .phoneNumber(dto.getPhoneNumber())
                .defaultShipping(dto.isDefaultShipping())
                .defaultBilling(dto.isDefaultBilling())
                .build();

        return toDto(addressRepository.save(address));
    }

    @Transactional
    public AddressDto updateAddress(UUID userId, UUID addressId, AddressDto dto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId.toString()));

        if (!address.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Address", "id", addressId.toString());
        }

        if (dto.isDefaultShipping() && !address.isDefaultShipping()) {
            clearDefaultShipping(userId);
        }
        if (dto.isDefaultBilling() && !address.isDefaultBilling()) {
            clearDefaultBilling(userId);
        }

        address.setRecipientName(dto.getRecipientName());
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setDefaultShipping(dto.isDefaultShipping());
        address.setDefaultBilling(dto.isDefaultBilling());

        return toDto(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId.toString()));

        if (address.getUserId().equals(userId)) {
            addressRepository.delete(address);
        }
    }

    @Transactional
    public void setDefaultShipping(UUID userId, UUID addressId) {
        clearDefaultShipping(userId);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId.toString()));
        if (address.getUserId().equals(userId)) {
            address.setDefaultShipping(true);
            addressRepository.save(address);
        }
    }

    private void clearDefaultShipping(UUID userId) {
        List<Address> addresses = addressRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Address a : addresses) {
            if (a.isDefaultShipping()) {
                a.setDefaultShipping(false);
                addressRepository.save(a);
            }
        }
    }

    private void clearDefaultBilling(UUID userId) {
        List<Address> addresses = addressRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Address a : addresses) {
            if (a.isDefaultBilling()) {
                a.setDefaultBilling(false);
                addressRepository.save(a);
            }
        }
    }

    private AddressDto toDto(Address a) {
        return AddressDto.builder()
                .id(a.getId())
                .userId(a.getUserId())
                .recipientName(a.getRecipientName())
                .street(a.getStreet())
                .city(a.getCity())
                .state(a.getState())
                .postalCode(a.getPostalCode())
                .country(a.getCountry())
                .phoneNumber(a.getPhoneNumber())
                .defaultShipping(a.isDefaultShipping())
                .defaultBilling(a.isDefaultBilling())
                .build();
    }
}
